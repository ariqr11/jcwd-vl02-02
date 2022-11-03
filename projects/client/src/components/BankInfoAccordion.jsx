import React from "react";
import { Accordion } from 'flowbite-react';
import { AccordionPanel } from "flowbite-react/lib/esm/components/Accordion/AccordionPanel";
import { AccordionTitle } from "flowbite-react/lib/esm/components/Accordion/AccordionTitle";

const BankInfo = (props) => {

    return (
        <div className="text-start my-4">
            <Accordion>
                <AccordionPanel>
                    <AccordionTitle>
                        Bank Negara Indonesia (BNI)
                    </AccordionTitle>
                    <Accordion.Content>
                        <ol>
                            <li className="flex">
                                <p>1.</p>
                                <p className="ml-2">Enter BNI ATM Card & PIN.</p>
                            </li>
                            <li className="flex">
                                <p>2.</p>
                                <p className="ml-2">Select the Other Transactions menu {'>'} Transfer {'>'} to the BNI Virtual Account.</p>
                            </li>
                            <li className="flex">
                                <p>3.</p>
                                <p className="ml-2">Enter the 5 digit company code for Medcare (10011) and the mobile number you registered in your Medcare account (example: 10011081234567890).</p>
                            </li>
                            <li className="flex">
                                <p>4.</p>
                                <p className="ml-2">On the confirmation page, make sure the payment details are correct such as No. VA, Name, Product and Total Bill.</p>
                            </li>
                            <li className="flex">
                                <p>5.</p>
                                <p className="ml-2">Make sure your name and total bill are correct.</p>
                            </li>
                            <li className="flex">
                                <p>6.</p>
                                <p className="ml-2">If it is correct, click Yes.</p>
                            </li>
                            <li className="flex">
                                <p>7.</p>
                                <p className="ml-2">Save the transaction receipt as proof of payment.</p>
                            </li>
                        </ol>
                    </Accordion.Content>
                </AccordionPanel>
                <AccordionPanel>
                    <AccordionTitle>
                        Bank Central Asia (BCA)
                    </AccordionTitle>
                    <Accordion.Content>
                        <ol>
                        <li className="flex">
                                <p>1.</p>
                                <p className="ml-2">Enter BCA ATM Card & PIN.</p>
                            </li>
                            <li className="flex">
                                <p>2.</p>
                                <p className="ml-2">Select the Other Transactions menu {'>'} Transfer {'>'} to the BCA Virtual Account.</p>
                            </li>
                            <li className="flex">
                                <p>3.</p>
                                <p className="ml-2">Enter the 5 digit company code for Medcare (10011) and the mobile number you registered in your Medcare account (example: 10011081234567890).</p>
                            </li>
                            <li className="flex">
                                <p>4.</p>
                                <p className="ml-2">On the confirmation page, make sure the payment details are correct such as No. VA, Name, Product and Total Bill.</p>
                            </li>
                            <li className="flex">
                                <p>5.</p>
                                <p className="ml-2">Make sure your name and total bill are correct.</p>
                            </li>
                            <li className="flex">
                                <p>6.</p>
                                <p className="ml-2">If it is correct, click Yes.</p>
                            </li>
                            <li className="flex">
                                <p>7.</p>
                                <p className="ml-2">Save the transaction receipt as proof of payment.</p>
                            </li>
                        </ol>
                    </Accordion.Content>
                </AccordionPanel>
                <AccordionPanel>
                    <AccordionTitle>
                        Bank Rakyat Indonesia (BRI)
                    </AccordionTitle>
                    <Accordion.Content>
                        <ol>
                        <li className="flex">
                                <p>1.</p>
                                <p className="ml-2">Enter BRI ATM Card & PIN.</p>
                            </li>
                            <li className="flex">
                                <p>2.</p>
                                <p className="ml-2">Select the Other Transactions menu {'>'} Transfer {'>'} to the BRI Virtual Account.</p>
                            </li>
                            <li className="flex">
                                <p>3.</p>
                                <p className="ml-2">Enter the 5 digit company code for Medcare (10011) and the mobile number you registered in your Medcare account (example: 10011081234567890).</p>
                            </li>
                            <li className="flex">
                                <p>4.</p>
                                <p className="ml-2">On the confirmation page, make sure the payment details are correct such as No. VA, Name, Product and Total Bill.</p>
                            </li>
                            <li className="flex">
                                <p>5.</p>
                                <p className="ml-2">Make sure your name and total bill are correct.</p>
                            </li>
                            <li className="flex">
                                <p>6.</p>
                                <p className="ml-2">If it is correct, click Yes.</p>
                            </li>
                            <li className="flex">
                                <p>7.</p>
                                <p className="ml-2">Save the transaction receipt as proof of payment.</p>
                            </li>
                        </ol>
                    </Accordion.Content>
                </AccordionPanel>
            </Accordion>
        </div>
    )
};

export default BankInfo;