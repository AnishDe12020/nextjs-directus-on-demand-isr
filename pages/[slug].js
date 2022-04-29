import directus from "../lib/directus";
import styles from "../styles/BlogPost.module.css";

const BlogPage = ({ post }) => {
  console.log(post);

  return (
    <div className={styles.container}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
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
      post: res.data[0],
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
