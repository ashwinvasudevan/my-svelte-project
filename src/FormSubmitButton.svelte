<script>
  import { Button, InlineLoading } from "carbon-components-svelte";

  export let form;
  export let activeMsg = "Submitting";
  export let completedMsg = "Success!";

  let state = form.getState();

  const descriptionMap = {
    active: activeMsg,
    finished: completedMsg,
  };
</script>

{#if $state !== "default"}
  <InlineLoading status={$state} description={descriptionMap[$state]} />
{:else}
  <Button type="submit">Submit</Button>
{/if}
