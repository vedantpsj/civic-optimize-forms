import * as yup from "yup";

export const theaterRentalSchema = yup.object().shape({
  type: yup.string().required(),
  show_title: yup.string().required(),
  item_name: yup.string().required(),
  category: yup.string().required(),
  cost: yup.string().required(),
  quantity: yup.string().required(),
  description: yup.string().required(),
  image: yup.string().required(),
  imageId: yup.string().optional()
});
