import { gql } from '@apollo/client'
import { client } from '../../lib/apollo'
import styles from '../../styles/Home.module.css'
import NextLink from 'next/link'

const PostPage = ({ post }) => {
  return (
    <div className={styles.main}>
      <h2>{post.title}</h2>
      <NextLink href="/">
        <a>&larr; Back</a>
      </NextLink>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}

export default PostPage

export async function getStaticPaths() {
  const result = await client.query({
    query: gql`
      query GetPostsPath {
        posts {
          nodes {
            slug
          }
        }
      }
    `
  })
  return {
    paths: result.data.posts.nodes.map(({ slug }) => {
      return {
        params: { slug }
      }
    }),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const result = await client.query({
    query: gql`
      query GetPostBySlug($slug: String!) {
        postBy(slug: $slug) {
          title
          content
        }
      }
    `,
    variables: { slug }
  })

  return {
    props: {
      post: result.data.postBy
    }
  }
}
