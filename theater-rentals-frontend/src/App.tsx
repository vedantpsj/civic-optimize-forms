import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AddWhiteIcon from "../src/assets/images/add-white.svg";
import AddIcon from "../src/assets/images/add.svg";
import DeleteWhiteIcon from "../src/assets/images/delete-white.svg";
import DeleteIcon from "../src/assets/images/delete.svg";
import EditWhiteIcon from "../src/assets/images/edit-white.svg";
import EditIcon from "../src/assets/images/edit.svg";
import "./App.scss";
import ButtonLoader from "./Components/Input/ButtonLoader/ButtonLoader";
import Input from "./Components/Input/Input";
import { theaterRentalSchema } from "./assets/form/formSchema";
import UseApiService, { API_URL } from "./services/axios.service";

function App() {
  const [type, setType] = useState<string | undefined>("0");
  const [showTitles, setShowTitles] = useState<string[]>([]);
  const [itemNames, setItemNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const {
    watch,
    reset,
    resetField,
    formState: { errors, isValid },
    setValue,
    register,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(theaterRentalSchema),
    defaultValues: {
      type: "0",
      show_title: "",
      item_name: "",
      category: "",
      cost: "",
      quantity: "",
      description: "",
      image: "",
    },
  });

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast("");
      }, 3000);
    }
  }, [toast]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  const typeSubscription = watch(["type"]);
  const showTitleSubscription = watch(["show_title"]);
  const itemNameSubscription = watch(["item_name"]);

  function resetForm() {
    resetField("show_title");
    resetField("item_name");
    resetField("category");
    resetField("cost");
    resetField("description");
    resetField("quantity");
  }
  useEffect(() => {
    setType(typeSubscription[0]);
  }, [typeSubscription[0]]);

  useEffect(() => {
    resetForm();
    if (type === "1" || type === "2") {
      getShowTitles();
    }
  }, [type]);

  useEffect(() => {
    console.log(showTitleSubscription[0]);
    if (type === "0") {
    } else {
      getTitles(showTitleSubscription[0]);
    }
  }, [showTitleSubscription[0]]);

  useEffect(() => {
    if (type === "0") {
    } else {
      getDetails(showTitleSubscription[0], itemNameSubscription[0]);
    }
  }, [itemNameSubscription[0]]);

  function addClicked() {
    setValue("type", "0");
  }

  function editClicked() {
    setValue("type", "1");
  }

  function deleteClicked() {
    setValue("type", "2");
  }

  function submitForm(data: any) {
    validate(data);
  }

  async function getShowTitles() {
    try {
      const res = await UseApiService().get({ url: API_URL.GET_SHOW_TITLES });
      setShowTitles(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getTitles(show_title = "") {
    try {
      const res = await UseApiService().get({
        url: API_URL.GET_TITLES,
        data: {
          show_title,
        },
      });
      setItemNames(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getDetails(show_title = "", item = "") {
    try {
      const res = await UseApiService().get({
        url: API_URL.GET_DETAILS,
        data: {
          show_title,
          item,
        },
      });
      setValue("category", res.data.category);
      setValue("cost", res.data.rent_for_2_weeks);
      setValue("quantity", res.data.quantity);
      setValue("description", res.data.description);
    } catch (error) {
      console.log(error);
    }
  }

  async function onFileSelected(event: any) {
    try {
      // const file: File = event.target.files[0];
      // console.log(file);
      // const fileUrl = API_URL.UPLOAD + uuidv4() + "?publish=true";
      // const res = await UseApiService().uploadFile(file, fileUrl);
      // console.log(res);
    } catch (error) {}
  }

  async function validate(data: any) {
    try {
      const obj = {
        url: API_URL.VALIDATE,
        data: data,
      };
      setLoading(true);
      await UseApiService().post(obj);
      updateInventory(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message);
      setLoading(false);
    }
  }

  async function updateInventory(data: any) {
    try {
      const obj = {
        url: API_URL.MANAGE_INVENTORY,
        data,
      };
      const res = await UseApiService().post(obj);
      reset();
      setLoading(false);
      setToast("Inventory updated successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message);
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div className="theaterData d-flex align-items-center justify-content-center">
      <div className="theaterData__form row">
        <div className="col-md-4 theaterData__form-sidebar">
          <div
            onClick={addClicked}
            className={`theaterData__form-sidebarAction d-flex align-items-center ${
              type === "0" && "active"
            }`}
          >
            <img src={AddWhiteIcon} alt="Add" />
            <img src={AddIcon} alt="Add" />
            <a className="theaterData__form-actionItem">Add</a>
          </div>
          <div
            onClick={editClicked}
            className={`theaterData__form-sidebarAction d-flex align-items-center ${
              type === "1" && "active"
            }`}
          >
            <img src={EditWhiteIcon} alt="Edit" />
            <img src={EditIcon} alt="Edit" />
            <a>Edit</a>
          </div>
          <div
            onClick={deleteClicked}
            className={`theaterData__form-sidebarAction d-flex align-items-center ${
              type === "2" && "active"
            }`}
          >
            <img src={DeleteWhiteIcon} alt="Delete" />
            <img src={DeleteIcon} alt="Delete" />
            <a>Delete</a>
          </div>
        </div>
        <div className="col-md-8 theaterData__form-content">
          <form id="add-form">
            <h1>Theater rentals inventory</h1>
            <div className="mt-5">
              {type === "0" ? (
                <Input
                  required={true}
                  label={"Show title"}
                  type="text"
                  extraClass="form-control"
                  placeholder="Show title"
                  name="show_title"
                  errors={errors}
                  register={register}
                />
              ) : (
                <div className="mb-3">
                  <label className="theaterData__form-formLabel mb-1">
                    Show title<span className="text-danger">*</span>
                  </label>
                  <select
                    className="theaterData__form-formSelect form-select"
                    {...register("show_title")}
                  >
                    <option value="">Choose Show Title</option>
                    {showTitles.map((el) => {
                      return (
                        <option value={el} key={el}>
                          {el}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {type === "0" ? (
                <Input
                  required={true}
                  label={"Item name"}
                  type="text"
                  extraClass="form-control"
                  placeholder="Item name"
                  name="item_name"
                  errors={errors}
                  register={register}
                />
              ) : (
                <div className="mb-3">
                  <label className="theaterData__form-formLabel mb-1">
                    Item name<span className="text-danger">*</span>
                  </label>
                  <select
                    className="theaterData__form-formSelect form-select"
                    {...register("item_name")}
                  >
                    <option value="">Choose Item Name</option>

                    {itemNames.map((el) => {
                      return (
                        <option value={el} key={el}>
                          {el}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="theaterData__form-formLabel mb-1">
                  Item category<span className="text-danger">*</span>
                </label>
                <select
                  disabled={
                    (type === "1" && !itemNameSubscription[0]) || type === "2"
                  }
                  className="theaterData__form-formSelect form-select"
                  {...register("category")}
                >
                  <option value="">Choose category</option>
                  <option value="costume inventory">Costume inventory</option>
                  <option value="prop inventory">Prop inventory</option>
                  <option value="set inventory">Set inventory</option>
                </select>
              </div>

              <Input
                disabled={
                  (type === "1" && !itemNameSubscription[0]) || type === "2"
                }
                label={"Item cost"}
                required={true}
                type="number"
                extraClass="form-control"
                placeholder="Item name"
                name="cost"
                errors={errors}
                register={register}
              />

              <Input
                disabled={
                  (type === "1" && !itemNameSubscription[0]) || type === "2"
                }
                label={"Item quantity"}
                required={true}
                type="number"
                extraClass="form-control"
                placeholder="Item name"
                name="quantity"
                errors={errors}
                register={register}
              />

              <Input
                disabled={
                  (type === "1" && !itemNameSubscription[0]) || type === "2"
                }
                label={"Description"}
                required={true}
                type="text"
                extraClass="form-control"
                placeholder="Item name"
                name="description"
                errors={errors}
                register={register}
              />

              {/* <input type="file" onChange={onFileSelected} /> */}

              <div className="theaterData__form-button d-flex mt-5">
                <div
                  className={`theaterData__message alert ${
                    toast ? " text-success" : ""
                  } ${error ? " text-danger" : ""}   ${
                    toast || error ? "" : "d-none"
                  }`}
                  role="alert"
                >
                  {toast || error}
                </div>

                <button
                  id="addBtn"
                  className="button primary d-flex align-items-center justify-content-center"
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit(submitForm)}
                >
                  Submit
                  {loading && <ButtonLoader />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
