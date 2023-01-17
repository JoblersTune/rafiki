// TODO: This file is still a very rough work in progress
import formStyles from '../styles/dist/Form.css'
import {
  Form,
  Link,
  useLoaderData,
  useCatch,
  useTransition as useNavigation
} from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import * as R from 'ramda'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { gql } from '@apollo/client'
import type {
  Peer,
  UpdatePeerInput,
  UpdatePeerMutationResponse
} from '../generated/graphql'
import { apolloClient } from '../lib/apolloClient'

function UpdatePeer({ peer }: { peer: Peer }) {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  return (
    <Form method='post' id='peer-form'>
      {/* hidden form field to pass back peer id */}
      <input type='hidden' name='peerId' value={peer.id} />
      <span>
        <label htmlFor='asset-id'>Peer ID</label>
        <p>{peer.id}</p>
      </span>
      <span>
        <label htmlFor='ilp-address'>Static ILP address</label>
        <input
          type='text'
          id='ilp-address'
          name='staticIlpAddress'
          defaultValue={peer.staticIlpAddress}
          required
        />
      </span>
      <span>
        <label htmlFor='incoming-auth-tokens'>Incoming HTTP auth tokens</label>
        <input
          type='text'
          id='incoming-auth-tokens'
          name='incomingAuthTokens'
        />
      </span>
      <span>
        <label htmlFor='outgoing-auth-token'>Outgoing HTTP auth token</label>
        <input
          type='text'
          id='outgoing-auth-token'
          name='outgoingAuthToken'
          required
        />
      </span>
      <span>
        <label htmlFor='outgoing-endpoint'>Outgoing HTTP endpoint</label>
        <input
          type='text'
          id='outgoing-endpoint'
          name='outgoingEndpoint'
          defaultValue={peer.http.outgoing.endpoint}
          required
        />
      </span>
      <span>
        <label htmlFor='asset-code'>Asset code</label>
        <p>{peer.asset.code}</p>
      </span>
      <span>
        <label htmlFor='asset-scale'>Asset scale</label>
        <p>{peer.asset.scale}</p>
      </span>
      <span>
        <label htmlFor='max-pckt-amount'>Max packet amount</label>
        <input
          type='number'
          id='max-pckt-amount'
          name='maxPacketAmount'
          defaultValue={peer.maxPacketAmount}
        />
      </span>
      <div className='bottom-buttons form-actions'>
        <Link to='/peers'>
          <button type='button' className='basic-button left'>
            Cancel
          </button>
        </Link>
        <button
          type='submit'
          disabled={isSubmitting}
          className='basic-button right'
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </Form>
  )
}

export default function UpdatePeerPage() {
  const { peer }: { peer: Peer } = useLoaderData()
  return (
    <main>
      <div className='header-row'>
        <h1>Update Peer</h1>
      </div>
      <div className='main-content'>
        <UpdatePeer peer={peer} />
      </div>
    </main>
  )
}

export async function action({ request }: ActionArgs) {
  const formData = Object.fromEntries(await request.formData())
  const incomingAuthTokens = formData.incomingAuthTokens
    ? (formData.incomingAuthTokens as string)
    : null

  // TODO: Add validation
  // TODO: no fields are required here except ID
  const variables: { input: UpdatePeerInput } = {
    input: {
      id: formData.peerId,
      http: {
        incoming: {
          authTokens: incomingAuthTokens?.replace(/ /g, '').split(',')
        },
        outgoing: {
          authToken: formData.outgoingAuthToken,
          endpoint: formData.outgoingEndpoint
        }
      },
      maxPacketAmount: formData.maxPacketAmount
        ? parseInt(formData.maxPacketAmount, 10)
        : null,
      staticIlpAddress: formData.staticIlpAddress
    }
  }

  const peerId = await apolloClient
    .mutate({
      mutation: gql`
        mutation UpdatePeer($input: UpdatePeerInput!) {
          updatePeer(input: $input) {
            code
            message
            success
            peer {
              id
            }
          }
        }
      `,
      variables: variables
    })
    .then((query): UpdatePeerMutationResponse => {
      if (query.data) {
        return query.data.updatePeer.peer.id
      } else {
        let errorMessage, status
        // In the case when GraphQL returns an error.
        if (R.path(['errors', 0, 'message'], query)) {
          errorMessage = R.path(['errors', 0, 'message'], query)
          status = parseInt(R.path(['errors', 0, 'code'], query), 10)
          // In the case when the GraphQL query is correct but the creation fails due to a conflict for instance.
        } else if (R.path(['data', 'updatePeer'], query)) {
          errorMessage = R.path(['data', 'updatePeer', 'message'], query)
          status = parseInt(R.path(['data', 'updatePeer', 'code'], query), 10)
          // In the case where no error message could be found.
        } else {
          errorMessage = 'Peer was not successfully updated.'
        }
        throw json(
          {
            message: errorMessage
          },
          {
            status: status
          }
        )
      }
    })

  return redirect('/peers/' + peerId)
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.peerId, `params.peerId is required`)
  const variables: { peerId: string } = {
    peerId: params.peerId
  }
  // TODO: validation on peerId

  const peer = await apolloClient
    .query({
      query: gql`
        query Peer($peerId: String!) {
          peer(id: $peerId) {
            id
            staticIlpAddress
            createdAt
            asset {
              scale
              code
            }
            http {
              outgoing {
                endpoint
              }
            }
          }
        }
      `,
      variables: variables
    })
    .then((query): Peer => {
      if (query.data) {
        return query.data.peer
      } else {
        throw new Error(`Could not find peer with ID ${params.peerId}`)
      }
    })

  return json({ peer: peer })
}

export function CatchBoundary() {
  const caughtResponse = useCatch()
  let heading = caughtResponse.status ? `${caughtResponse.status}` : ''
  if (caughtResponse.statusText) {
    heading += ` ${caughtResponse.statusText}`
  }
  return (
    <div>
      {heading && <h2>{heading}</h2>}
      <p>{caughtResponse.data?.message || 'An Error Occurred'}</p>
      <Link to='/peers'>
        <button className='basic-button'>Back</button>
      </Link>
    </div>
  )
}

export function links() {
  return [{ rel: 'stylesheet', href: formStyles }]
}
