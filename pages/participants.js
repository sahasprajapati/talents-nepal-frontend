import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { useEffect, useState } from 'react'
import { useFirestoreQuery } from '@react-query-firebase/firestore'
import { collection, limit, query } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'

export const POSTS_PER_PAGE = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return { props: { initialDisplayPosts, posts, pagination } }
}

export default function Participant({ posts, initialDisplayPosts, pagination }) {
  const ref = query(collection(firestore, 'user_profile'), limit(10))

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
      <PageSEO
        title={`Participant - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Participants"
      />
    </>
  )
}
