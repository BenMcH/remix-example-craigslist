import { MetaFunction, LinksFunction, LoaderFunction, redirect, useRouteData, Link, Form, ActionFunction  } from "remix";
import Chance from 'chance';
import {v4} from 'uuid';

import stylesUrl from "../../../styles/category.css";
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
  const text = (await request.text());
  const body = new URLSearchParams(text);

  const title = body.get('title');
  const content = body.get('content');
  const email = body.get('email');
  const postId = v4()

  if (!title || !content || !email) {
    return redirect('/')
  }

  const post: IPost = {
      title,
      categoryId: category,
      content,
      email,
      postId,
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
      <h3>{'Add a new post'}</h3>
      <Form method="post" action="">
        <label>Title: </label>
        <input type="text" name="title" required />
        <label>Content: </label>
        <textarea name="content" required rows={10} />
        <label>Email: </label>
        <input type="text" name="email" required />
        <button type="submit">{'Create Post'}</button>
      </Form>
    </div>
  );
}
