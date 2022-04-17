import React from 'react';
import TeamsList from '../../components/team/TeamsList';
import MainResponsive from '../../container/MainResponsive';

function TeamManagePage() {
  return (
    <MainResponsive>
      <TeamsList />
    </MainResponsive>
  );
}

export default TeamManagePage;
