import NewAsset, { links as NewAssetLinks } from '../../components/NewAsset.jsx'
import { redirect, json } from '@remix-run/node'
import fetch from '../../fetch'
import * as R from 'ramda'
import type { ActionArgs } from '@remix-run/node'
import { Link, useCatch } from '@remix-run/react'
import { validateString, validatePositiveInt } from '../../lib/validate.server'

export default function CreateAssetPage() {
  return (
    <main>
      <div className='header-row'>
        <h1>Create Asset</h1>
      </div>
      <div className='main-content'>
        <NewAsset />
      </div>
    </main>
  )
}

export async function action({ request }: ActionArgs) {
  const formData = Object.fromEntries(await request.formData())

  const formErrors = {
    assetCode: validateString(formData.assetCode, 'asset code'),
    assetScale: validatePositiveInt(formData.assetScale, 'asset scale'),
    withdrawalThreshold: validatePositiveInt(
      formData.withdrawalThreshold,
      'withdrawal threshold',
      false
    )
  }

  // If there are errors, return the form errors object
  if (Object.values(formErrors).some(Boolean)) return { formErrors }

  const variables = {
    input: {
      code: formData.assetCode,
      scale: parseInt(formData.assetScale as string, 10),
      withdrawalThreshold: formData.withdrawalThreshold
        ? parseInt(formData.withdrawalThreshold as string, 10)
        : null
    }
  }

  const query = `
    mutation Mutation($input: CreateAssetInput!){
        createAsset(input: $input) {
            asset {
                id
            }
            code
            message
            success
        }
    }
    `

  const result = await fetch({ query, variables })

  const assetId = R.path(['data', 'createAsset', 'asset', 'id'], result)
  if (!assetId) {
    let errorMessage, status
    // In the case when GraphQL returns an error.
    if (R.path(['errors', 0, 'message'], result)) {
      errorMessage = R.path(['errors', 0, 'message'], result)
      status = parseInt(R.path(['errors', 0, 'code'], result), 10)
      // In the case when the GraphQL query is correct but the creation fails due to a conflict for instance.
    } else if (R.path(['data', 'createAsset'], result)) {
      errorMessage = R.path(['data', 'createAsset', 'message'], result)
      status = parseInt(R.path(['data', 'createAsset', 'code'], result), 10)
      // In the case where no error message could be found.
    } else {
      errorMessage = 'Asset was not successfully created.'
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
  return redirect('/assets/' + assetId)
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
      <Link to='/assets'>
        <button className='basic-button'>Back</button>
      </Link>
    </div>
  )
}

export function links() {
  return [...NewAssetLinks()]
}