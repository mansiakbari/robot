# Human in the loop front-end integration

## Main application page

* Get the list of analysis through the `/analysis` end-point in the back-end.
    * Such an end-point returns an array of JSON objects, with attributes:
    ```
    {
      "id": number, <= ID of the analysis
      "action_id": number, <= ignore for now
      "checkpoint_type": string, <= matching with the ones returned from the /checkpoint end-point
      "robot": string, <= robot name; use "as is", maybe capitalising it when using it for labels
      "date": string, <= date of the analysis request; use for standard ordering
      "processed": boolean <= see below
    }
    ```
    * The items can be split by tabs between "pending" and "processed" by using the "processed" attribute
    * "checkpoint_type" can be missing or be "null". See later about how to handle this case.
* Clicking on any line of the table should open the related analysis page.

## Analysis page

* The measurement to be visualised has to be fetched with the `/analysis/{analysis_id}/measurement` end-point
* After loading the measurement, the rest of the page depends on the "checkpoint_type" of the analysis, as reported above:
    * If the analysis has a defined checkpoint type, then use the `/checkpoint` end-point to get information about what needs to be rendered in the page.
        * The response JSON, the attributes for the individual items are: "id", "type" and "fields".
        * In the "fields" attribute, the content is a stringified JSON, which contains the elements to be shown, e.g.:
        ```
        "{"fields": [
            {
                "text": "State",
                "object": "RadioButton",
                "options": ["Open", "Closed"]
            }]}"
        ```
        In this case, a Radio-button with options "Open" and "Closed" and the label "State" should be rendered
    * In the case no checkpoint is defined for the analysis, after loading the measurement, there should be a pop-up from the application asking "What kind of checkpoint does this measurement refer to?" and the list of existing checkpoints (as fetched through the `/checkpoint` end-point), plus a "unknown" option, a radio button for each of the options, and an "OK" button.
        * In case one of the existing checkpoints is selected and the answer is accepted, this should trigger a "POST" to the `/analysis/{analysis_id}/measurement` end-point, with the name of the selected checkpoint (e.g. "dial_gauge")
        * Otherwise, the analysis page should close, triggering a "PUT" ​to the `/analysis​/{analysis_id}​/result` end-point, sending an inconclusive result (see later)
* In the page there's always 2 buttons: "Inconclusive" and "Confirm"
    * Once a result has been filled in, the "Confirm" button should become active.
        * Clicking on the "Confirm" button should trigger a "Are you sure?" kind of pop-up, with a summary of the analysis result that's about to be sent. This will be in the form of `key: value`; e.g., using the previous example with a radio button: "State: Open"
        * Once that is confirmed, the application should reload the main page, and trigger a "PUT" ​to the `/analysis​/{analysis_id}​/result` end-point, sending a JSON with the same structure of the summary shown before; following the example, it would be `{"state": "open"}`. In particular the value of the "text" attribute from the checkpoint "fields" is always expected as key in the JSON (transformed to lower case), and its value should be whatever input the user selected or filled in.
    * The "Inconclusive" button should always be active. When it's clicked, it should open a pop-up with various reasons why it could be inconclusive, plus a text box for custom reasons. Clicking "OK" should trigger a "PUT" ​to the `/analysis​/{analysis_id}​/result` end-point, sending an inconclusive result, which consists of an empty JSON (`{}`) - currently there's no use for the reason (but it's an anticipated feature in the future)
        * The application should then reload the home page.
* Every time a result is sent to the back-end, the analysis list should be fetched again, so to be able to catch the changes in the "processed" flag, and return an accurate list of the pending analyses

