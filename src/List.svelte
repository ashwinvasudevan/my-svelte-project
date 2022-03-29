<script>
  import "carbon-components-svelte/css/white.css";

  import {
    Form,
    FormGroup,
    Checkbox,
    Button,
    Search,
    OrderedList,
    ListItem,
  } from "carbon-components-svelte";

  import { ListStore } from "./list-store.js";
  import createFieldStore from "./store-field";

  let searchField = createFieldStore({
    type: "search",
  });

  let listStore = new ListStore();

  let syncState = listStore.syncState;
</script>

<Search
  labelText="Search"
  placeholder="Enter Search"
  bind:value={$searchField.value}
/>
{#if $syncState}
  Syncing
{/if}

{#each $listStore as listItem}
  <OrderedList>
    <ListItem><Checkbox labelText="Label text" /></ListItem>
    <ListItem><Checkbox labelText="Label text" /></ListItem>
    <ListItem><Checkbox labelText="Label text" /></ListItem>
  </OrderedList>
{/each}
