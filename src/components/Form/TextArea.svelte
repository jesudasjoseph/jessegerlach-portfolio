<script lang="ts">
  let {
    id,
    name,
    value = $bindable(""),
    required,
  }: { id: string; name: string; value: string; required?: boolean } = $props();
</script>

<span class="relative block">
  <span class="border border-white w-8 h-0 bottom-0 left-0 absolute rounded-lg"
  ></span>
  <span class="border border-white w-8 h-0 top-0 right-0 absolute rounded-lg"
  ></span>
  <span class="border border-white h-6 w-0 bottom-0 left-0 absolute rounded-lg"
  ></span>
  <span class="border border-white h-6 w-0 top-0 right-0 absolute rounded-lg"
  ></span>
  <textarea
    class="p-4 w-full focus-visible:outline-gray-500 focus-visible:outline-1 rounded-tl-md rounded-br-md text-xl"
    {name}
    {id}
    bind:value
    {required}
  ></textarea>
</span>
