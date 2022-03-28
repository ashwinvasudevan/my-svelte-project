<script>
  import { TextInput } from "carbon-components-svelte";

  export let field;
  export let form;

</script>

{#if $field.type === "email"}
  <TextInput
    labelText="Email"
    bind:value={$field.value}
    invalid={!!$field.error}
    invalidText={$field.error?.message}
    required={$field.required}
    disabled={$form.loading || $field.disabled}
  />
{/if}
