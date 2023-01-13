import DisplayPeer, {
  links as DisplayItemsLinks
} from '../../components/DisplayPeer'
import * as R from 'ramda'
import fetch from '../../fetch'
import { json, redirect } from '@remix-run/node'
import { Link, useParams, Form, useLoaderData } from '@remix-run/react'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'

export default function ViewPeersPage() {
  const { peer } = useLoaderData()
  return (
    <main>
      <div className='header-row'>
        <h1>Peers</h1>
        <Form method='post' id='peer-search-form'>
          <span>
            <input
              type='search'
              id='peer-id'
              name='peerId'
              defaultValue={peer.id}
              required
            />
            <div className='form-actions'>
              <button className='search-button'>
                <img alt='Search' src={require('../../../public/search.svg')} />
              </button>
            </div>
          </span>
        </Form>
        <Link to={'/peers/update-' + peer.id}>
          <button className='basic-button'>Update</button>
        </Link>
      </div>
      <div className='main-content'>
        <DisplayPeer />
      </div>
      <div className='bottom-buttons'>
        <button className='basic-button left' disabled={true}>
          Delete
        </button>
        <Link to='/peers'>
          <button className='basic-button right'>Done</button>
        </Link>
      </div>
    </main>
  )
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.peerId, `params.peerId is required`)
  const variables = {
    peerId: params.peerId
  }
  const query = `
  query Peer($peerId: String!) {
    peer(id: $peerId) {
      id
      staticIlpAddress
      http {
        outgoing {
          endpoint
        }
      }
      createdAt
      asset {
        code
        scale
        id
      }
    }
  }
  `

  const result = await fetch({ query, variables })

  const peer = R.path(['data', 'peer'], result)

  invariant(peer, `Could not find peer with ID ${params.peerId}`)

  return json({ peer: peer })
}

export async function action({ request }: ActionArgs) {
  // TODO: extend to be a global search bar
  const formData = await request.formData()
  const peerData = {
    peerID: formData.get('peerId')
  }

  if (!peerData.peerID) {
    throw json(
      {
        message: 'Unable to access peer ID'
      },
      {
        status: 404,
        statusText: 'Not Found'
      }
    )
  }
  return redirect('/peers/' + peerData.peerID)
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { peerId } = useParams()

  if (peerId) {
    return (
      <div>
        <p>There was an error loading the peer with ID {peerId}.</p>
        {error.message.length > 0 && <p>Error: {error.message}</p>}
        <Link to='/peers'>
          <button className='basic-button'>Back</button>
        </Link>
      </div>
    )
  }
  return (
    <div>
      <p>There was an error loading this peer.</p>
      {error.message.length > 0 && <p>Error: {error.message}</p>}
      <Link to='/peers'>
        <button className='basic-button'>Back</button>
      </Link>
    </div>
  )
}

export function links() {
  return [...DisplayItemsLinks()]
}