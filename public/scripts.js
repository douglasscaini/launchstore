// MÁSCARA DE VALOR DO PRODUCTS CREATE
const Mask = {
  apply(input, func) {
    setTimeout(function () {
      input.value = Mask[func](input.value);
    }, 1);
  },
  formatBRL(value) {
    value = value.replace(/\D/g, "");

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  },
};

// LÓGICA DE INSERÇÃO DE FOTOS PRODUCT CREATE
const PhotosUploud = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploudLimit: 6,
  files: [],

  handleFileInput(event) {
    const { files: fileList } = event.target;

    PhotosUploud.input = event.target;

    if (PhotosUploud.hasLimit(event)) return;

    Array.from(fileList).forEach((file) => {
      PhotosUploud.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.src = String(reader.result);

        const div = PhotosUploud.getContainer(image);

        PhotosUploud.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    });

    PhotosUploud.input.files = PhotosUploud.getAllFiles();
  },
  hasLimit(event) {
    const { uploudLimit, input, preview } = PhotosUploud;
    const { files: fileList } = input;

    if (fileList.length > uploudLimit) {
      alert(`Envie no máximo ${uploudLimit} fotos!`);
      event.preventDefault();

      return true;
    }

    const photosDiv = [];

    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList.value == "photo") {
        photosDiv.push(item);
      }
    });

    const totalPhotos = fileList.length + photosDiv.length;

    if (totalPhotos > uploudLimit) {
      alert("Você atingiu o limite máximo de fotos!");
      event.preventDefault();

      return true;
    }

    return false;
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

    PhotosUploud.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div");

    div.classList.add("photo");

    div.onclick = PhotosUploud.removePhoto;

    div.appendChild(image);

    div.appendChild(PhotosUploud.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement("i");

    button.classList.add("material-icons");
    button.innerHTML = "close";

    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUploud.preview.children);
    const index = photosArray.indexOf(photoDiv);

    PhotosUploud.files.splice(index, 1);
    PhotosUploud.input.files = PhotosUploud.getAllFiles();

    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]');

      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  },
};

// CONFIRMAÇÃO DE EXCLUSÃO PRODUCTS EDIT
const formDelete = document.querySelector("#form-delete");
if (formDelete) {
  itemFormDelete(formDelete);
}

function itemFormDelete(formDelete) {
  formDelete.addEventListener("submit", function (event) {
    const confirmation = confirm("Deseja Deletar?");

    if (!confirmation) {
      event.preventDefault();
    }
  });
}
