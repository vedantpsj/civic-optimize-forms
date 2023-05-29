const editForm = document.getElementById("edit-form");
const addForm = document.getElementById("add-form");
const hideIfDelete = document.getElementById("hide-if-delete");
const addButton = document.getElementById("add");
const editButton = document.getElementById("edit");
const deleteButton = document.getElementById("delete");
const showTitle = document.getElementById("show_title");
const item = document.getElementById("item");
const category = document.getElementById("category");
const cost = document.getElementById("cost");
const quantity = document.getElementById("quantity");
const snackBar = document.getElementById("snackBar");
const snackBar1 = document.getElementById("snackBar1");
const editBtn = document.getElementById("editBtn");
const addBtn = document.getElementById("addBtn");
var action_type = "0";
const API_URL = "http://" + window.location.hostname;

addFunc();

class AddEditForm {
  show_title = "";
  item = "";
  category = "";
  cost = 0;
  quantity = 0;
  constructor(data) {
    this.show_title = data.show_title;
    this.item = data._item;
    this.category = data.category;
    this.cost = data.cost;
    this.quantity = data.quantity;
  }
}

function addFunc() {
  addForm.style.display = "block";
  editForm.style.display = "none";
  action_type = "0";
  addButton.classList.add("active");
  editButton.classList.remove("active");
  deleteButton.classList.remove("active");
}

function editFunc() {
  editForm.style.display = "block";
  addForm.style.display = "none";
  hideIfDelete.style.display = "block";
  action_type = "1";
  getShowTitles();
  editButton.classList.add("active");
  addButton.classList.remove("active");
  deleteButton.classList.remove("active");
}

function deleteFunc() {
  editFunc();
  hideIfDelete.style.display = "none";
  action_type = "2";
  addButton.classList.remove("active");
  editButton.classList.remove("active");
  deleteButton.classList.add("active");
}

function getFormValues(form) {
  const reqBody = {};
  Object.keys(form.elements).forEach((key) => {
    let element = form.elements[key];
    if (element.type !== "submit") {
      reqBody[element.name] = element.value;
    }
  });
  return reqBody;
}

async function addFormValue(event) {
  event.preventDefault();
  const values = toValidateForm(getFormValues(addForm));
  if (!values) {
    return;
  }
  try {
    addBtn.disabled = true;
    await axios.post(`${API_URL}/validate`, values);
    await postData(values);
  } catch (err) {
    showToast(err?.response?.data?.message ?? err?.message, "alert-danger");
  } finally {
    addBtn.disabled = false;
  }
}

async function editFormValue(event) {
  event.preventDefault();
  const values = toValidateForm(getFormValues(editForm));
  if (!values) {
    return;
  }
  await postData(values);
}

async function getShowTitles() {
  try {
    const res = await axios.get(`${API_URL}/get-show-titles`);

    showTitle.innerHTML = null;
    const option = document.createElement("option");
    option.innerText = "Choose title";
    option.value = "";
    showTitle.appendChild(option);
    item.disabled = true;
    item.innerHTML = null;
    const itemOption = document.createElement("option");
    itemOption.innerText = "Choose item";
    itemOption.value = "";
    item.appendChild(itemOption);

    for (let i = 0; i < res?.data?.length; i++) {
      const option = document.createElement("option");
      option.innerText = res?.data?.[i];
      option.value = res.data[i];
      showTitle.appendChild(option);
    }
    category.value = "";
    cost.value = "";
    quantity.value = "";
    category.disabled = true;
    cost.disabled = true;
    quantity.disabled = true;
  } catch (error) {
    console.log(error);
  }
}

async function getTitles() {
  try {
    if (showTitle.value) {
      const res = await axios.get(`${API_URL}/get-titles`, {
        params: { show_title: showTitle.value ?? "" },
      });
      item.disabled = false;
      item.innerHTML = null;
      const option = document.createElement("option");
      option.innerText = "Choose item";
      option.value = "";
      item.appendChild(option);
      for (let i = 0; i < res?.data?.length; i++) {
        const option = document.createElement("option");
        option.value = res?.data?.[i];
        option.innerText = res?.data?.[i];
        item.appendChild(option);
      }
      category.value = "";
      cost.value = "";
      quantity.value = "";
      category.disabled = true;
      cost.disabled = true;
      quantity.disabled = true;
    } else {
      item.disabled = true;
      item.value = "";
      category.disabled = true;
      category.value = "";
      cost.disabled = true;
      cost.value = "";
      quantity.disabled = true;
      quantity.value = "";
    }
  } catch (error) {
    console.log(error);
  }
}

async function getDetails() {
  try {
    if (item.value && showTitle.value) {
      const details = await axios.get(`${API_URL}/get-details`, {
        params: { show_title: showTitle.value ?? "", item: item.value ?? "" },
      });
      category.disabled = false;
      cost.disabled = false;
      quantity.disabled = false;
      category.value = details?.data?.category;
      cost.value = details?.data?.rent_for_2_weeks;
      quantity.value = details?.data?.quantity;
    } else {
      category.disabled = true;
      category.value = "";
      cost.disabled = true;
      cost.value = "";
      quantity.disabled = true;
      quantity.value = "";
    }
  } catch (error) {
    console.log(error);
  }
}
async function postData(values) {
  try {
    addBtn.disabled = true;
    editBtn.disabled = true;
    await axios.post(`${API_URL}/manage-inventory`, values);
    showToast("Success", "alert-success");
    setTimeout(() => {
      addForm.reset();
      editForm.reset();
      hideToast();
      addFunc();
    }, 500);
  } catch (err) {
    showToast(err?.response?.data?.message ?? err.message, "alert-danger");
  } finally {
    addBtn.disabled = false;
    editBtn.disabled = false;
  }
}

function toValidateForm(values) {
  const submittedValue = new AddEditForm(values);
  for (const [key, value] of Object.entries(submittedValue)) {
    if (
      ((action_type === "0" || action_type === "1") && value.trim() === "") ||
      (value.trim() == 0 && (key === "cost" || key === "quantity"))
    ) {
      showToast("Fill all details to submit the form", "alert-danger");
      return false;
    }
  }
  return { ...submittedValue, action_type };
}

function showToast(message, _class) {
  if (action_type === "1" || action_type == 2) {
    snackBar1.innerText = message;
    snackBar1.classList.remove("alert-danger");
    snackBar1.classList.remove("alert-success");
    snackBar1.classList.add(_class);
    snackBar1.style.display = "block";
    setTimeout(() => {
      snackBar1.innerText = "";
      snackBar1.classList.remove(_class);
      snackBar1.style.display = "none";
    }, 10000);
  } else {
    snackBar.innerText = message;
    snackBar.classList.remove("alert-danger");
    snackBar.classList.remove("alert-success");
    snackBar.classList.add(_class);
    snackBar.style.display = "block";
    setTimeout(() => {
      snackBar.innerText = "";
      snackBar.classList.remove(_class);
      snackBar.style.display = "none";
    }, 10000);
  }
}

function hideToast() {
  if (snackBar1) {
    snackBar1.innerText = "";
    snackBar1.classList.remove("alert-danger");
    snackBar1.classList.remove("alert-success");
    snackBar1.style.display = "none";
  }
  if (snackBar) {
    snackBar.innerText = "";
    snackBar.classList.remove("alert-danger");
    snackBar.classList.remove("alert-success");
    snackBar.style.display = "none";
  }
}
