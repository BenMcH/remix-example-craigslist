export interface IPost {
  title: string
  content: string
  postedAt: string
  email: string
  postId: string
  categoryId: string
}

const db = new Map<string, IPost[]>();

export const getPosts: (categoryId: string) => IPost[] | undefined = (categoryId) => db.get(categoryId);

export const addPost: (categoryId: string, post: IPost) => IPost = (categoryId, post) => {
  let posts = db.get(categoryId) || [];
  db.set(categoryId, posts);

  posts.push(post);

  return post;
}
