Feature: Simple feature test on GDN project

  Scenario: Total amount
    Given I buy 2 pens
    And Each pen cost 10000 vnd
    And I have a coupon 200 vnd
    Then Total amount should be equal 19800 vnd