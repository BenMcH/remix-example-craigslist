import { MetaFunction, LinksFunction, LoaderFunction, redirect, useRouteData, Link, Form, ActionFunction  } from "remix";
import Chance from 'chance';

import stylesUrl from "../../../styles/index.css";
import { getCategory, ISection } from '../../../services/category';
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

export let loader: LoaderFunction = async ({params}) => {
  const category = getCategory(params.section, params.category);

  if (!category) {
    return {category};
  }

  const posts = getPosts(category.id) || [];

  const post = posts.find(({postId}) => postId === params.postId);


  return {category, post};
};

export default function Index() {
  const {category, post} = useRouteData();

  if (!post) {
    return (
      <div>
        <h1>{'Post Not Found'}</h1>
        <Link to="/">{'Go Home'}</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: 20, maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>{post.email}</p>
      <p>{post.postedAt}</p>
    </div>
  );
}
