var productService = {
    createProduct: function (product) {
      return axios({
        url: "https://639570eaa68e43e418e8b181.mockapi.io/api/products",
        method: "POST",
        data: product,
      });
    },

    fetchProduct: function () {
      return axios({
        url: "https://639570eaa68e43e418e8b181.mockapi.io/api/products",
        method: "GET",
      });
    },
    deleteProduct: function (id) {
      return axios({
        url: "https://639570eaa68e43e418e8b181.mockapi.io/api/products/" + id,
        method: "DELETE",
      });
    },

    fetchProductDetail: function (id) {
      return axios({
        url: "https://639570eaa68e43e418e8b181.mockapi.io/api/products/" + id,
        method: "GET",
      });
    },

    updateProduct: function (product) {
      return axios({
        url:
          "https://639570eaa68e43e418e8b181.mockapi.io/api/products/" + product.id,
        method: "PUT",
        data: product,
      });
    },
}