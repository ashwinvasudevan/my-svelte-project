<script>
  import { TextInput, Checkbox } from "carbon-components-svelte";

  export let field;
  export let form;
  export let labelText;
  export let placeholder;
</script>

{#if $field.type === "email"}
  <TextInput
    type="email"
    {labelText}
    {placeholder}
    bind:value={$field.value}
    invalid={!!$field.error}
    invalidText={$field.error?.message}
    required={$field.required}
    disabled={$form.loading || $field.disabled}
    on:change={() => {
      // UPDATE VALUE TO DIRTY?
      // ashwin
      console.log($field)
    }}
  />
{:else if $field.type === "boolean"}
  <Checkbox labelText="Label text" />
{/if}
