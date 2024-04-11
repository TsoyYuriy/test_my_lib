
var aPayWidget = document.getElementById("a-pay-widget");

aPayWidget.style.cssText = `
  display: flex;
  visibility: hidden;
  opacity: 0;
  transition: opacity .3s ease-in-out;
`;

const closeApayModal = () => {
  aPayWidget.style.opacity = 0;
  setTimeout(() => {
    aPayWidget.style.visibility = "hidden";
  }, 300)
};


class AsadalPayWidgetInstance {
  constructor(configs) {
    this.apiKey = configs.api_key;
    this.orderInfo = configs.order_info;
    this.isPaid = null;
    this.paymentCallback = null;
  }

  closeApayWidget() {
    var closeBtn = document.getElementById("a-pay-widget__close");
    var closeFrame = document.getElementById("a-pay-widget");
    closeBtn.addEventListener("click", closeApayModal);
    closeFrame.addEventListener("click", closeApayModal);
  }

  openApayWidget() {
    aPayWidget.style.visibility = "visible";
    aPayWidget.style.opacity = 1;

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
        aPayWidget.innerHTML = `<div class="a-pay-widget__content" id="a-pay-widget__content">
                                  <span class="a-pay-widget__close" id="a-pay-widget__close">&times;</span>
                                  <iframe id="a-pay-widget__iframe" src=${data.iframe_url} frameborder="0" height="652" width="100%"></iframe>
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

window.CustomAsadalPayPaymentWidgetInstance = AsadalPayWidgetInstance;
