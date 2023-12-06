<script src="vendor/api.bitrix24.v1.js"></script>
<script src="js/functions.js?v=<?= rand(); ?>"></script>
<script>
  var currentPlacement = getPlacementInfo();

  if (currentPlacement.kp) {
    document.location.href = "phase3.php";
  } else if (currentPlacement.entity === "task") {
    document.location.href = "phase2.php";
  } else {
    document.location.href = "phase1.php";
  }
</script>
