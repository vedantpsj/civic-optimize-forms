import * as yup from "yup";

export const theaterProductionSchema = yup.object().shape({
  type: yup.string().required(),
  show_title: yup.string().required(),
  cost: yup.string().required(),
  description: yup.string().required(),
  image: yup.string().required(),
  imageId: yup.string().optional(),
});
