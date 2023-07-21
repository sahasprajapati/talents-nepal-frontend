import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

import NewsletterForm from '@/components/NewsletterForm'
import { collection, limit, query } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { useFirestoreQuery } from '@react-query-firebase/firestore'
import Card from '@/components/Card'
import { useEffect, useState } from 'react'

const MAX_DISPLAY = 5

export async function getServerSideProps() {
  const sth = await getAllFilesFrontMatter('blog')

  return { props: { sth } }
}

export default function Home({ sth }) {
  const ref = query(collection(firestore, 'user_profile'), limit(6))

  // Provide the query to the hook
  const firestoreQuery = useFirestoreQuery(['user_profile'], ref)

  const [participants, setParticipants] = useState([])
  useEffect(() => {
    if (firestoreQuery?.data) {
      console.log('qu', firestoreQuery)
      const snapshot = firestoreQuery.data
      console.log('Dta', snapshot)
      const data = snapshot?.docs?.map((docSnapshot) => {
        const data = docSnapshot.data()
        console.log('Data', data)
        return data
        // return <div key={docSnapshot.id}>{data.name}</div>
      })
      setParticipants(data)
    }
  }, [firestoreQuery.data])
  console.log(participants)
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!participants?.length && 'No participants found.'}
          {participants?.map((participant) => {
            const { slug, user_name, teamName } = participant
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        Paid Status
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <Card
                        key={'d.title'}
                        title={user_name}
                        description={teamName}
                        imgSrc={''}
                        href={'d.href'}
                      />
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {participants.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/participants"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all participants"
          >
            All participants &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
