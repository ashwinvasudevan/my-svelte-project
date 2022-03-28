<script>
  import { min, verifyEmail } from "./validators";

  import "carbon-components-svelte/css/white.css";
  import FormComponent from "./FormComponent.svelte";

  import { Form, FormGroup, Button } from "carbon-components-svelte";
  import FormSubmitButton from "./FormSubmitButton.svelte";
  import createFormStore from "./store-form";

  let fields = [
    {
      labelText: "Email",
      placeholder: "Enter email",
      type: "email",
      validators: [verifyEmail],
    },
    {
      labelText: "password",
      placeholder: "Enter password",
      type: "password",
      validators: [min(4)],
    },
  ];

  let form = createFormStore({
    fields,
  });
</script>

<Form
  class="border-b-2 border-t-2 border-gray-300 border-solid pt-4 mt-10 pb-10 space-y-5"
  on:submit={form.submit}
>
  {#each $form.fields as field}
    <FormGroup>
      <FormComponent {field} {form} />
    </FormGroup>
  {/each}

  <FormSubmitButton {form} />
</Form>
