<script>
  import { TextInput, Checkbox, Search } from "carbon-components-svelte";

  export let field;
  export let form;
  export let labelText;
  export let placeholder;
  export let autoValidate = false;
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
    on:input={() => autoValidate && field.validate()}
  />
{:else if $field.type === "password"}
  <TextInput
    type="password"
    {labelText}
    {placeholder}
    bind:value={$field.value}
    invalid={!!$field.error}
    invalidText={$field.error?.message}
    required={$field.required}
    disabled={$form.loading || $field.disabled}
    on:input={() => autoValidate && field.validate()}
  />
{:else if $field.type === "search"}
  <Search {labelText} {placeholder} />
{:else if $field.type === "boolean"}
  <Checkbox labelText="Label text" />
{/if}
