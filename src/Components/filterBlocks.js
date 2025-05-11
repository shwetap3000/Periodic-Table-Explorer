export const getMainElements = (elementsData) =>
  elementsData.filter((element) => element.block !== "f");
//   const fBlockElements = elementsData.filter(element => element.block === 'f');

export const getLanthanides = (elementsData) =>
  elementsData.filter(
    (element) => element.period === 6 && element.block === "f"
  );

export const getActinides = (elementsData) =>
  elementsData.filter(
    (element) => element.period === 7 && element.block === "f"
  );
