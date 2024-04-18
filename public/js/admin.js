const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;

  const productElement = btn.closest("article");

  console.log(prodId);
  fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
  })
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      console.log(result);
      productElement.parentNode.removeChild(productElement);
    })
    // .then(() => {
    //   location.reload();
    // })
    .catch((err) => {
      console.log(err);
    });
};
