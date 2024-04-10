class CustomPaymentWidget {
  constructor(configs) {
    this.apiKey = configs.api_key;
    this.orderInfo = configs.order_info;
    this.isPaid = null;
    this.paymentCallback = null;
  }

  closeModal() {
    var closeBtn = document.querySelector(".close");

    closeBtn.addEventListener("click", function () {
      document.getElementById("myModal").style.display = "none";
    });
  }

  openModal() {
    var modal = document.getElementById("myModal");
    var iFrame = document.querySelector("iframe");
    modal.style.display = "block";

    fetch("http://localhost:8000/api/orders/create-order", {
      method: "POST",
      headers: {
        "api-key": this.apiKey,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(this.orderInfo),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const link = data.iframe_url;
        iFrame.setAttribute("src", link);
        iFrame.style.width = "100%";

        window.addEventListener(
          "message",
          (event) => {

            this.isPaid = event.data;
            // Вызываем функцию обратного вызова для передачи статуса оплаты в приложение
            if (this.paymentCallback) {
              this.paymentCallback(this.isPaid);
            }
          },
          false
        );
      })
      .catch((error) => {
        console.error("Произошла ошибка:", error);
      });
  }

  setPaymentCallback(callback) {
    this.paymentCallback = callback;
  }
}

window.CustomPaymentWidgetInstance = CustomPaymentWidget;
