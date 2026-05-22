type ExpenseInput = {
  itemName: string;
  itemQuantity: string;
  itemPrice: string;
};

export const getIsValidExpense = ({
  itemName,
  itemQuantity,
  itemPrice,
}: ExpenseInput) => {
  return (
    itemName.trim() &&
    itemQuantity &&
    Number.parseInt(itemQuantity, 10) > 0 &&
    itemPrice &&
    Number.parseFloat(itemPrice) > 0
  );
};
