provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "devops-rg" {
  name     = "tp-devops"
  location = "East US"
}

resource "azurerm_virtual_network" "devops-vn" {
  name                = "devops-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.devops-rg.location
  resource_group_name = azurerm_resource_group.devops-rg.name
}

resource "azurerm_subnet" "devops-sub" {
  name                 = "devops-subnet"
  resource_group_name  = azurerm_resource_group.devops-rg.name
  virtual_network_name = azurerm_virtual_network.devops-vn.name
  address_prefixes    = ["10.0.0.0/24"]
}

resource "azurerm_public_ip" "devops-pip" {
  name                = "devops-public-ip"
  resource_group_name = azurerm_resource_group.devops-rg.name
  location            = azurerm_resource_group.devops-rg.location
  allocation_method   = "Dynamic"
}

resource "azurerm_network_interface" "devops-nic" {
  name                = "devops-nic"
  location            = azurerm_resource_group.devops-rg.location
  resource_group_name = azurerm_resource_group.devops-rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.devops-sub.id
    private_ip_address            = "10.0.0.5"
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.devops-pip.id
  }
}

resource "azurerm_windows_virtual_machine" "devops-wvm" {
  name                  = "devops-vm"
  resource_group_name   = azurerm_resource_group.devops-rg.name
  location              = azurerm_resource_group.devops-rg.location
  size                  = "Standard_D2s_v3"
  admin_username        = "ismail"
  admin_password        = "#Ismail123456"

  network_interface_ids = [azurerm_network_interface.devops-nic.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "MicrosoftWindowsServer"
    offer     = "WindowsServer"
    sku       = "2019-Datacenter"
    version   = "latest"
  }
}
