class AsadalPayWidget {
  constructor(configs) {
    this.apiKey = configs.api_key;
    this.orderInfo = configs.order_info;
    this.isPaid = null;
    this.paymentCallback = null;
  }

  closeApayWidget() {
    var closeBtn = document.querySelector(".close");

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        document.getElementById("myModal").style.display = "none";
      });
    } else {
      console.error("Элемент с классом .close не найден");
    }
  }

  openApayWidget() {
    var modal = document.getElementById("a-pay-widget");
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
        modal.innerHTML = `<div class="modal-content">
                            <span class="close">&times;</span>
                            <iframe id="a-pay-iframe" src=${data.iframe_url} frameborder="0" height="652" width="100%"></iframe>
                          </div>`;

        window.addEventListener(
          "message",
          (event) => {
            this.isPaid = event.data;
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

window.ApayWidget = AsadalPayWidget;
