import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import DeleteWhiteIcon from "../../src/assets/images/delete-white.svg";
import DeleteIcon from "../../src/assets/images/delete.svg";
import EditWhiteIcon from "../../src/assets/images/edit-white.svg";
import EditIcon from "../../src/assets/images/edit.svg";
import "../App.scss";
import ButtonLoader from "../Components/Input/ButtonLoader/ButtonLoader";
import Input from "../Components/Input/Input";
import { theaterProductionSchema } from "../assets/form/productionFormSchema";
import AddWhiteIcon from "../assets/images/add-white.svg";
import AddIcon from "../assets/images/add.svg";
import UseApiService, { API_URL } from "../services/production.axios.service";

function Production() {
  const [type, setType] = useState<string | undefined>("0");
  const [showTitles, setShowTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>("");
  const imageRef = useRef<any>(null);

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
    resolver: yupResolver(theaterProductionSchema),
    defaultValues: {
      type: "0",
      show_title: "",
      cost: "",
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

  function resetForm() {
    resetField("show_title");
    resetField("cost");
    resetField("description");
    resetFileState();
  }

  function resetFileState() {
    setImageSrc("");
    setImage(null);
    if (imageRef?.current?.value) {
      imageRef.current.value = null;
    }
  }

  async function getTokens() {
    const obj = {
      url: API_URL.TOKENS,
      data: {
        auth: process.env.REACT_APP_AUTH,
      },
    };
    const res = await UseApiService().get(obj);
    return res.data;
  }

  function submitForm(data: any) {
    validate(data);
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
      const imageId = image ? await uploadImage() : data.imageId;
      delete data["imageId"];
      const obj = {
        url: API_URL.MANAGE_INVENTORY,
        data: { ...data, image: imageId },
      };
      const res = await UseApiService().post(obj);
      reset();
      setImage(null);
      setImageSrc("");
      setLoading(false);
      setToast("Inventory updated successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message);
      setLoading(false);
      console.log(error);
    }
  }

  async function getShowTitles() {
    try {
      const res = await UseApiService().get({ url: API_URL.GET_SHOW_TITLES });
      setShowTitles(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getImage(id: string) {
    try {
      const { hcmsToken } = await getTokens();
      const url = `${API_URL.GET_IMAGE}/${id}`;
      const headers = {
        Authorization: "Bearer " + hcmsToken,
      };
      const res: any = await UseApiService().getFile(url, headers);
      const src = res.data._links.content.href;
      setImageSrc(`https://content.civicplus.com${src}`);
      const imageName = src.substring(src.lastIndexOf("/") + 1);
      setValue("image", imageName);
    } catch (error) {
      console.log(error);
    }
  }
  async function getDetails(show_title = "") {
    try {
      const res = await UseApiService().get({
        url: API_URL.GET_DETAILS,
        data: {
          show_title,
        },
      });
      setValue("cost", res.data.show_cost);
      setValue("description", res.data.description);
      if (res.data.image) {
        getImage(res.data.image);
        setValue("imageId", res.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onFileSelected(event: any) {
    const file: File = event.target.files[0];
    setImage(file);
    getImageBase64(file);
    setValue("image", file.name);
  }

  function getImageBase64(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImageSrc(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  useEffect(() => {
    resetForm();
    if (type === "1" || type === "2") {
      getShowTitles();
    }
  }, [type]);

  useEffect(() => {
    setType(typeSubscription[0]);
  }, [typeSubscription[0]]);

  useEffect(() => {
    if (type === "0") {
    } else {
      if (showTitleSubscription) {
        getDetails(showTitleSubscription[0]);
      } else {
        resetForm();
      }
    }
  }, [showTitleSubscription[0]]);

  function addClicked() {
    setValue("type", "0");
  }

  function editClicked() {
    setValue("type", "1");
  }

  function deleteClicked() {
    setValue("type", "2");
  }

  async function uploadImage() {
    try {
      const { hcmsToken = "", permissionSet = "" } = await getTokens();

      const headers = {
        Authorization: "Bearer " + hcmsToken,
        "Content-Type": "multipart/form-data",
      };
      if (image) {
        const res: any = await UseApiService().uploadFile(
          image,
          headers,
          permissionSet
        );
        return res.data.id;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  return (
    <div className="theaterData__form">
      <div className="row">
        <div className="col-md-4 d-flex">
          <div className="theaterData__form-sidebar w-100">
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
        </div>
        <div className="col-md-8">
          <div className="theaterData__form-content">
            <form id="add-form">
              <h1>Theater Production</h1>
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

                <Input
                  disabled={
                    (type === "1" && !showTitleSubscription[0]) || type === "2"
                  }
                  label={"Show Description"}
                  required={true}
                  type="text"
                  extraClass="form-control"
                  placeholder="description"
                  name="description"
                  errors={errors}
                  register={register}
                />

                <Input
                  disabled={
                    (type === "1" && !showTitleSubscription[0]) || type === "2"
                  }
                  label={"Package Rate"}
                  required={true}
                  type="number"
                  extraClass="form-control"
                  placeholder="Package Rate"
                  name="cost"
                  errors={errors}
                  register={register}
                />
                <div className="mb-3">
                  <label className="theaterData__form-formLabel mb-1">
                    Featured Image<span className="text-danger">*</span>
                  </label>
                  {imageSrc && (
                    <div className="theaterData__form-imgWrap position-relative rounded">
                      {type !== "2" && (
                        <button
                          type="button"
                          className="close w-20 h-20 position-absolute rounded-circle"
                          aria-label="Close"
                          onClick={resetFileState}
                        >
                          <span className="d-block h-100 " aria-hidden="true">
                            &times;
                          </span>
                        </button>
                      )}
                      <img
                        className="w-100 h-100 object-fit-cover"
                        src={imageSrc.toString()}
                        alt=""
                      />
                    </div>
                  )}
                  {!imageSrc && (
                    <div className="form-floating theaterData__form-formFloating mb-3">
                      <input
                        type="file"
                        onChange={onFileSelected}
                        accept="image/*"
                        ref={imageRef}
                      />
                    </div>
                  )}
                </div>
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
    </div>
  );
}

export default Production;