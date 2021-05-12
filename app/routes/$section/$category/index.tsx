import { MetaFunction, LinksFunction, LoaderFunction, redirect, useRouteData, Link, Form, ActionFunction  } from "remix";
import Chance from 'chance';

import stylesUrl from "../../../styles/index.css";
import { getCategory } from '../../../services/category';
import { getPosts, IPost, addPost } from '../../../services/posts';

const chance = new Chance();

export let meta: MetaFunction = () => {
  return {
    title: "benslist",
    description: "Benslist: The place to buy and sell your stuff"
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let action: ActionFunction = async ({ request, params: {category, section} }) => {
  const post: IPost = {
      title: chance.sentence(),
      content: chance.paragraph(),
      email: chance.email(),
      postId: chance.guid(),
      postedAt: new Date().toISOString()
  }

  addPost(category, post);
  
  return redirect(`/${section}/${category}/${post.postId}`);
};

export let loader: LoaderFunction = async ({params}) => {
  const category = getCategory(params.section, params.category);

  if (!category) {
    return {category};
  }

  const posts = getPosts(category.id) || [];

  return {section: params.section, category, posts};
};

export default function Index() {
  const {section, category, posts} = useRouteData();

  if (!category) {
    return (
      <div>
        <h1>{'Category Not Found'}</h1>
        <Link to="/">{'Go Home'}</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: 20, maxWidth: '800px', margin: '0 auto' }}>
      <h1>{category.name}</h1>

      {posts.map((post: IPost) => (
        <article key={post.postId}>
          <h4>{post.title}</h4>
          <p>{post.content.substring(0, 100)}{'...'}</p>
          <p>{`Contact: ${post.email}`}</p>
          <Link to={`/${section}/${category.id}/${post.postId}`}>
            {'Read Post'}
          </Link>
          {' | '}
          <small>{post.postedAt}</small>
        </article>
      ))}
      <Form method="post" action="">
        <h3>{'Add a new post'}</h3>
        <button type="submit">{'Create Random Post'}</button>
      </Form>
    </div>
  );
}
