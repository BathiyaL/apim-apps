/*
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Utils from "@support/utils";
import OpenAPIPage from "../../../support/pages/publisher/OpenAPIPage";

describe("publisher-021-03 : Lint when creating API with swagger v2 file", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });
    
    before(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
        cy.loginToPublisher(publisher, password);
        OpenAPIPage.waitUntillLoadingComponentsExit()
    });

    it("Lint when creating API with swagger v2 file", () => {
        cy.visit(`${Utils.getAppOrigin()}/`+OpenAPIPage.getUrl());
        OpenAPIPage.waitUntillLoadingComponentsExit()
        // select the option from the menu item
        OpenAPIPage.openFileSelectRadioButton().click()

        // upload the swagger
        cy.intercept('GET', '**/linter-custom-rules').as('linter-custom-rules');
        OpenAPIPage.browseToUploadButton().then(function () {
            const filepath = `api_artifacts/petstore_open_api_2.json`
            OpenAPIPage.fileUploadInput().attachFile(filepath)            
        });
        cy.wait('@linter-custom-rules',{timeout: 25000}).its('response.statusCode').should('equal', 204)

        // check linter results
        OpenAPIPage.linterResultDivBlock().should('be.visible');
        OpenAPIPage.errorsToggleButton().contains("1")
        OpenAPIPage.warningToggleButton().contains("22")
        
    });

    after(function () {
        cy.logoutFromPublisher();
        // delete user
        //cy.visit(`${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
        //cy.deleteUser(publisher);
    })
})