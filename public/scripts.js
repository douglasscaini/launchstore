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
