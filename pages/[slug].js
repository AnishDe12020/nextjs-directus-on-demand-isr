import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import directus from "../lib/directus";
import styles from "../styles/BlogPost.module.css";

const BlogPage = ({ post }) => {
  return (
    <div className={styles.container}>
      <h1>{post.title}</h1>
      <MDXRemote {...post.content} />
    </div>
  );
};

export const getStaticProps = async ({ params }) => {
  const res = await directus.items("blog").readByQuery({
    filter: { slug: params.slug },
    fields: ["title", "content"],
  });

  return {
    props: {
      post: {
        title: res.data[0].title,
        content: await serialize(res.data[0].content),
      },
    },
  };
};

export const getStaticPaths = async () => {
  const res = await directus.items("blog").readByQuery({
    limit: -1,
    fields: ["slug"],
  });

  return {
    paths: res.data.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

export default BlogPage;
