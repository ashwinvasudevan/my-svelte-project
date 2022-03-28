<script>
  import { Button, InlineLoading } from "carbon-components-svelte";

  export let form;
  export let activeMsg = "Submitting";
  export let completedMsg = "Success!";

  const descriptionMap = {
    active: activeMsg,
    finished: completedMsg,
  };
</script>

{#if $form.state !== "default"}
  <InlineLoading
    status={$form.state}
    description={descriptionMap[$form.state]}
  />
{:else}
  <Button type="submit">Submit</Button>
{/if}
