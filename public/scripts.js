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

  cpfCnpj(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 14) {
      value = value.slice(0, -1);
    }

    if (value.length > 11) {
      value = value.replace(/(\d{2})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1-$2");
    }

    return value;
  },

  cep(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, -1);
    }

    value = value.replace(/(\d{5})(\d)/, "$1-$2");

    return value;
  },
};

// VALIDAÇÃO DE EMAIL
const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    let results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) {
      Validate.displayError(input, results.error);
    }
  },

  displayError(input, error) {
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerHTML = error;

    input.parentNode.appendChild(div);

    input.focus();
  },

  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error");

    if (errorDiv) {
      errorDiv.remove();
    }
  },

  isEmail(value) {
    let error = null;
    const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!value.match(mailFormat)) {
      error = "Email inválido!";
    }

    return {
      error,
      value,
    };
  },

  isCpfCnpj(value) {
    let error = null;

    const cleanValues = value.replace(/\D/g, "");

    if (cleanValues.length > 11 && cleanValues.length !== 14) {
      error = "CNPJ inválido!";
    } else if (cleanValues.length < 12 && cleanValues.length !== 11) {
      error = "CPF inválido!";
    }

    return {
      error,
      value,
    };
  },

  isCep(value) {
    let error = null;

    const cleanValues = value.replace(/\D/g, "");

    if (cleanValues.length !== 8) {
      error = "CEP inválido!";
    }

    return {
      error,
      value,
    };
  },

  allFields(event) {
    const items = document.querySelectorAll(".item input, .item select, .item textarea");

    for (item of items) {
      if (item.value == "") {
        const message = document.createElement("div");

        message.classList.add("messages");
        message.classList.add("error");

        message.style.position = "fixed";
        message.innerHTML = "Todos os campos são obrigatórios!";

        document.querySelector("body").append(message);
        event.preventDefault();
      }
    }
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

const ImageGallery = {
  highligth: document.querySelector(".gallery .highlight > img"),
  previews: document.querySelectorAll(".gallery-preview img"),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach((preview) => {
      preview.classList.remove("active");
    });

    target.classList.add("active");

    ImageGallery.highligth.src = target.src;
    Ligthbox.image.src = target.src;
  },
};

const Ligthbox = {
  target: document.querySelector(".lightbox-target"),
  image: document.querySelector(".lightbox-target img"),
  closeButton: document.querySelector(".lightbox-target a.lightbox-close"),
  open() {
    Ligthbox.target.style.opacity = 1;
    Ligthbox.target.style.top = 0;
    Ligthbox.target.style.bottom = 0;
    Ligthbox.closeButton.style.top = 0;
  },
  close() {
    Ligthbox.target.style.opacity = 0;
    Ligthbox.target.style.top = "-100%";
    Ligthbox.target.style.bottom = "initial";
    Ligthbox.closeButton.style.top = "-80px";
  },
};
