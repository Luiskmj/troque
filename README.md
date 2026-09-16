FLUXO

  1- O cadastro do admin ocorre quando o app é instalado na nuvemshopp

    METODO FIRST ACCESS
      - Metodo firstAccess onde vai buscar o code que esta na url no momento que foi instalado o app na nuvemshop.

      - Metodo nuvemShopToken, vai dar um post na nuvemshop, retornando os dados da loja (user_id, access_token)

      - Metodo storeNuvemShop, vai buscar os dados da loja (name.pt, email)

      - Check se o admin ja existe Salvo no admin  nuvemShopIdStore e nuvemShopStoreToken

      - e nao existir temos que criar

      - enviar um email para o admin criar uma senha
      - o email conter um link onde vai informar o token que foi gerado

    METODO RESET
      - Atravez do email enviado para o admin, ele vai conseguir reset a senha
      - O metodo vai receber o email, token, password
      - Validar o dados
  -----------------------------------------------------------------------------

  2 -
