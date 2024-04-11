class AsadalPayWidgetInstance {
  constructor(configs) {
    this.apiKey = configs.api_key;
    this.orderInfo = configs.order_info;
    this.isPaid = null;
    this.paymentCallback = null;

    this.aPayWidget = document.getElementById("a-pay-widget");
    this.closeBtn = document.getElementById("a-pay-widget__close");
  }

  closeApayModal() {
    this.aPayWidget.style.opacity = 0;
    setTimeout(() => {
      this.aPayWidget.style.visibility = "hidden";
    }, 300);
  }

  closeApayWidget() {
    // var closeFrame = document.getElementById("a-pay-widget");
    // this.closeBtn.addEventListener("click", this.closeApayModal);
    // this.aPayWidget.addEventListener("click", this.closeApayModal);
    
    if (this.aPayWidget) {
      this.aPayWidget && this.aPayWidget.addEventListener("click", this.closeApayModal.bind(this))
      this.aPayWidget.addEventListener("click", e => e.target === this.aPayWidget && this.closeApayModal());
    }
  }

  openApayWidget() {
    this.aPayWidget.style.visibility = "visible";
    this.aPayWidget.style.opacity = 1;

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
        console.log(data);
        this.aPayWidget.innerHTML = `<div class="a-pay-widget__content" id="a-pay-widget__content">
                                      <span class="a-pay-widget__close" id="a-pay-widget__close">&times;</span>
                                      <iframe id="a-pay-widget__iframe" src=${data.iframe_url} frameborder="0" height="752" width="100%"></iframe>
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

window.AsadalPayWidgetInstance = AsadalPayWidgetInstance;
