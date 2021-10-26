import { Errors } from 'ilp-packet'
import { RafikiContext } from '../rafiki'
import { isAccountTransferError } from '../../../account/errors'

export function createBalanceMiddleware() {
  return async (
    { request, response, services, accounts }: RafikiContext,
    next: () => Promise<unknown>
  ): Promise<void> => {
    const { amount } = request.prepare

    // Ignore zero amount packets
    if (amount === '0') {
      await next()
      return
    }

    const sourceAmount = BigInt(amount)
    const destinationAmountOrError = await services.rates.convert({
      sourceAmount,
      sourceAsset: accounts.incoming.asset,
      destinationAsset: accounts.outgoing.asset
    })
    if (typeof destinationAmountOrError !== 'bigint') {
      // ConvertError
      throw new Errors.CannotReceiveError(
        `Exchange rate error: ${destinationAmountOrError}`
      )
    }

    // Update balances on prepare
    const trxOrError = await services.accounts.transferFunds({
      sourceAccount: accounts.incoming,
      destinationAccount: accounts.outgoing,
      sourceAmount,
      destinationAmount: destinationAmountOrError,
      timeout: BigInt(5e9) // 5 seconds
    })

    await next()

    if (!isAccountTransferError(trxOrError)) {
      if (response.fulfill) {
        await trxOrError.commit()
      } else {
        await trxOrError.rollback()
      }
    }
  }
}