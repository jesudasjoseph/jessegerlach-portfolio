<script lang="ts">
  let {
    id,
    name,
    value = $bindable(""),
    required,
  }: { id: string; name: string; value: string; required?: boolean } = $props();
</script>

<textarea
  class="p-3 w-full focus-visible:outline-gray-500 border border-gray-500 focus-visible:outline-1 rounded-bl-xl rounded-tr-xl text-xl"
  {name}
  {id}
  bind:value
  {required}
></textarea>
