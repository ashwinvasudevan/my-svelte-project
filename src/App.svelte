<script>
  import "carbon-components-svelte/css/white.css";
  import FormComponent from "./FormComponent.svelte";

  import { Form, FormGroup, Button } from "carbon-components-svelte";
  import FormSubmitButton from "./FormSubmitButton.svelte";
  import RegisterForm from "./RegisterForm";

  let form = new RegisterForm();
</script>

<Form
  class="border-b-2 border-t-2 border-gray-300 border-solid pt-4 mt-10 pb-10 space-y-5"
  on:submit={(e) => {
    form.submit(e);
  }}
>
  <FormGroup>
    <FormComponent
      field={$form.email}
      {form}
      labelText="Email"
      placeholder="Enter Email"
      autoValidate={true}
    />
  </FormGroup>

  <FormGroup>
    <FormComponent
      field={$form.password}
      {form}
      labelText="Password"
      placeholder="Enter Password"
    />
  </FormGroup>

  <FormSubmitButton {form} />
</Form>
