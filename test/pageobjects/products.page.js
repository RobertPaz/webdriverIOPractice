class ProductosPagina {
    get BotonCarrito(){
        return $('button[id="cart-button"]')
    }

    /**
     * Funcion para presionar el botton abrir carrito de compras en la UI
     */
    async presionarBotonCarrito() {
        await this.BotonCarrito.click()
    }
}

export default new ProductosPagina();