from bs4 import BeautifulSoup
from selenium import webdriver
import sys

url = "https://www.continente.pt/pt-pt/public/Pages/searchresults.aspx?k=" + sys.argv[1]
print(url)
browser = webdriver.Chrome()

browser.get(url)

# print(browser)

html = browser.page_source

soup = BeautifulSoup(html, "html.parser")
divs = soup.find("div", {"class": "productBoxTop"}).get_text()

with open("scraped.txt", "w") as file:
    file.write(str(divs))

browser.quit()
