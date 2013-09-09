from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains

import ConfigParser
import os
import time
import unittest

class TestOrdering(unittest.TestCase):

    def setUp(self):

        config = ConfigParser.ConfigParser()
        configFile = os.path.dirname(os.path.abspath(__file__)) + "/../config/test.cfg"
        config.read(configFile)

        self.server = config.get("Functional", "server")

        self.browser = webdriver.Firefox() # Get local session of firefox
        self.browser.get(self.server)

    def testPageTitleShoulbBEDisplayedCorrectly(self):

        assert "Gestion du menu principal" in self.browser.title

    def testDragAndDropdShouldReorderMenu(self):

        addButton = self.browser.find_element_by_css_selector('.add_button button')
        addButton.click()
        addButton.click()

        firstItem = self.browser.find_element_by_css_selector('.menus .item:nth-child(1)')
        firstItem.click()

        titleField = self.browser.find_element_by_css_selector('.properties_form input[name="title"]')
        titleField.clear()
        titleField.send_keys("Premier menu" + Keys.RETURN)


        secondItem = self.browser.find_element_by_css_selector('.menus .item:nth-child(2)')
        secondItem.click()

        titleField = self.browser.find_element_by_css_selector('.properties_form input[name="title"]')
        titleField.clear()
        titleField.send_keys("Second menu" + Keys.RETURN)

        actionchains = ActionChains(self.browser)
        dragAndDrop = actionchains.drag_and_drop_by_offset(firstItem, secondItem.size.get('width') + 50, 0)
        dragAndDrop.perform()

        time.sleep(2)

        # Check ordering
        items = self.browser.find_elements_by_css_selector('.menus .item')

        print items[0].get_attribute('tabindex')

        self.assertEqual(int(items[0].get_attribute('tabindex')), 2)
        self.assertEqual(int(items[1].get_attribute('tabindex')), 1)

    def tearDown(self):
        self.browser.close()

if __name__ == '__main__':
    unittest.main()