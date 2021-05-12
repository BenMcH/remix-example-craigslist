interface ICategory {
  id: string
  name: string
}

export interface ISection {
  [key: string]: ICategory[]
}

export const getSections: () => ISection = () => ({
  'for_sale': [
    {
      id: 'free',
      name: 'free'
    },
    {
      id: 'auto',
      name: 'cars and trucks',
    },
    {
      id: 'furn',
      name: 'home furnishings',
    },
    {
      id: 'want',
      name: 'wanted',
    }
  ],
  'jobs': [
    {
      id: 'cust',
      name: 'customer service',
    },
    {
      id: 'real',
      name: 'real estate',
    },
    {
      id: 'soft',
      name: 'software',
    },
  ]
});

export const getCategory = (sectionName: string, categoryId: string): ICategory | undefined => {
  const section = getSections()[sectionName];

  if (section) {
    return section.find(({id}) => id === categoryId);
  }

  return undefined;
}
