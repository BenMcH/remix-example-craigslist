import { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData, Link } from "remix";

import stylesUrl from "../styles/index.css";
import { getSections, ISection } from '../services/category';

export let meta: MetaFunction = () => {
  return {
    title: "benslist",
    description: "Benslist: The place to buy and sell your stuff"
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  return {sections: getSections()};
};

export default function Index() {
  const {sections: routeSections} = useRouteData();
  const sections = routeSections as ISection;

  return (
    <div style={{ padding: 20, maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to Benslist!</h1>
      
      {
        Object.entries(sections).map(([sectionName, categories]) => (
          <section key={sectionName}>
            <h2>{sectionName}</h2>
            {
              categories.map((category) => (
                <Link key={category.id} to={`/${sectionName}/${category.id}`}>
                  {category.name}
                </Link>
              ))
            }
          </section>
        ))
      }
    </div>
  );
}
