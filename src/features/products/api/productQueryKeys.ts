export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (page: number, brands: string[] = []) =>
    [
      ...productKeys.lists(),
      {
        page,
        brands,
      },
    ] as const,
  infinite: (brands: string[] = []) =>
    [...productKeys.all, "infinite", { brands }] as const,
};
