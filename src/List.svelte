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
  listStore.add([{ a: "test", id: 1 }]);
  listStore.add({ a: "test", id: 2 });
  // $: console.log(listStore);
</script>

<Search
  labelText="Search"
  placeholder="Enter Search"
  bind:value={$searchField.value}
/>
{#if $syncState}
  Syncing
{/if}

<div>{$listStore.length}</div>

<OrderedList>
  {#each $listStore as listItem}
    <ListItem><Checkbox labelText="Label text" /></ListItem>
  {/each}
</OrderedList>

<button
  on:click={() => {
    listStore.add({ a: "test", id: listStore.items.length + 1 });
  }}>Add</button
>
<button
  on:click={() => {
    listStore.remove(listStore.items[0]);
  }}>Remove</button
>
<button
  on:click={() => {
    console.log(listStore.filter({a: "test", id: 1}));
  }}>Filter</button
>
<button
  on:click={() => {
  console.log(listStore.find({a: "test"}))
  }}>Find</button
>
<button on:click={() => listStore.reset()}>reset</button>
