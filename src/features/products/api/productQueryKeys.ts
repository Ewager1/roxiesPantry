export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (page: number) => [...productKeys.lists(), { page }] as const,

  infinite: () => [...productKeys.all, "infinite"] as const,
};
